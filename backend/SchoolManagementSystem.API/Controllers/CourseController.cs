using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models.DTOs;
using SchoolManagementSystem.API.Models.Entities;
using SchoolManagementSystem.API.Models;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CourseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ FIXED: GET all courses (clean DTO)
        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _context.Courses
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    CourseDescription = c.CourseDescription
                })
                .ToListAsync();

            return Ok(courses);
        }

        // ✅ FIXED: GET one course by ID (clean DTO)
        [Authorize(Roles = "Admin,Teacher,Student,Parent")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var course = await _context.Courses
                .Where(c => c.CourseId == id)
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    CourseDescription = c.CourseDescription
                })
                .FirstOrDefaultAsync();

            if (course == null)
                return NotFound("Course not found.");

            return Ok(course);
        }

        // ✅ POST create course (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddCourse([FromBody] CourseDto dto)
        {
            if (dto == null) return BadRequest("Invalid data.");

            var course = new Course
            {
                CourseName = dto.CourseName,
                CourseDescription = dto.CourseDescription
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            // Return created course as DTO
            var createdDto = new CourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                CourseDescription = course.CourseDescription
            };

            return CreatedAtAction(nameof(GetCourseById), new { id = course.CourseId }, createdDto);
        }

        // ✅ PUT update course (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditCourse(int id, [FromBody] CourseDto dto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound("Course not found.");

            course.CourseName = dto.CourseName;
            course.CourseDescription = dto.CourseDescription;

            await _context.SaveChangesAsync();
            return Ok("Course updated successfully.");
        }

        // ✅ DELETE course (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound("Course not found.");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return Ok("Course deleted.");
        }

        // ✅ FIXED: GET available courses (uses same DTO)
        [Authorize(Roles = "Student")]
        [HttpGet("available")]
        public async Task<IActionResult> ViewAvailableCourses()
        {
            var courses = await _context.Courses
                .Select(c => new CourseDto
                {
                    CourseId = c.CourseId,
                    CourseName = c.CourseName,
                    CourseDescription = c.CourseDescription
                })
                .ToListAsync();

            return Ok(courses);
        }

        // ✅ GET student's enrolled courses (Student/Parent)
        [Authorize(Roles = "Student,Parent")]
        [HttpGet("student-courses/{studentId}")]
        public async Task<IActionResult> ViewStudentCourses(int studentId)
        {
            var courses = await _context.StudentCourses
                .Where(sc => sc.StudentId == studentId)
                .Select(sc => new CourseDto
                {
                    CourseId = sc.Course.CourseId,
                    CourseName = sc.Course.CourseName,
                    CourseDescription = sc.Course.CourseDescription
                })
                .ToListAsync();

            return Ok(courses);
        }

        // ✅ GET students enrolled in a course (Admin/Teacher) → unchanged
        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("enrolled-students/{courseId}")]
        public async Task<IActionResult> ViewEnrolledStudents(int courseId)
        {
            var students = await _context.StudentCourses
                .Where(sc => sc.CourseId == courseId)
                .Select(sc => new
                {
                    sc.Student.StudentId,
                    sc.Student.FirstName,
                    sc.Student.LastName,
                    sc.Student.AdmissionNumber
                })
                .ToListAsync();

            return Ok(students);
        }

        // ✅ POST assign student to course (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost("assign-student")]
        public async Task<IActionResult> AssignStudentToCourse([FromBody] StudentCourseDto dto)
        {
            if (dto.StudentId == 0 || dto.CourseId == 0)
                return BadRequest("Invalid data.");

            var student = await _context.Students.FindAsync(dto.StudentId);
            if (student == null) return NotFound("Student not found.");
            var course = await _context.Courses.FindAsync(dto.CourseId);
            if (course == null) return NotFound("Course not found.");

            bool alreadyAssigned = await _context.StudentCourses
                .AnyAsync(sc => sc.StudentId == dto.StudentId && sc.CourseId == dto.CourseId);
            if (alreadyAssigned)
                return BadRequest("Student already enrolled in this course.");

            _context.StudentCourses.Add(new StudentCourse
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                EnrollementDate = dto.EnrollmentDate != default ? dto.EnrollmentDate : DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student assigned to course successfully" });
        }

        // 🟡 Placeholder stays unchanged
        [Authorize(Roles = "Teacher")]
        [HttpPost("manage-enrollments")]
        public IActionResult ManageEnrollments()
        {
            return Ok("Teacher managing enrollments - logic TBD.");
        }
    }
}
