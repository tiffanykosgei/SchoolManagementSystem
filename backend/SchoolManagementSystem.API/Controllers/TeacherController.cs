using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models;
using SchoolManagementSystem.API.Models.DTOs;
using SchoolManagementSystem.API.Models.Entities;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TeacherController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // ✅ Get all teachers (Admin)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllTeachers()
        {
            var teachers = await _context.Teachers
                .Include(t => t.CourseAssignments)
                    .ThenInclude(ca => ca.Course)
                .Include(t => t.User)
                .Select(t => new
                {
                    t.TeacherId,
                    t.RegNo,
                    t.FirstName,
                    t.LastName,
                    t.EmployeeNumber,
                    t.PhoneNumber,
                    t.Username,
                    t.UserId,
                    Courses = t.CourseAssignments.Select(ca => new
                    {
                        ca.CourseId,
                        ca.Course.CourseName
                    })
                })
                .ToListAsync();

            return Ok(teachers);
        }

        // ✅ Create teacher (Admin)
        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateTeacher([FromBody] TeacherDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RegNo))
                return BadRequest("RegNo is required.");
            if (string.IsNullOrWhiteSpace(dto.FirstName))
                return BadRequest("FirstName is required.");
            if (string.IsNullOrWhiteSpace(dto.LastName))
                return BadRequest("LastName is required.");

            // check if teacher with RegNo already exists
            var existingTeacher = await _context.Teachers.FirstOrDefaultAsync(t => t.RegNo == dto.RegNo);
            if (existingTeacher != null)
                return BadRequest("Teacher with this RegNo already exists.");

            // ✅ Create Teacher
            var teacher = new Teacher
            {
                RegNo = dto.RegNo,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmployeeNumber = dto.EmployeeNumber,
                PhoneNumber = dto.PhoneNumber,
                Username = dto.Username,
                UserId = dto.UserId
            };

            // ✅ Add optional initial courses if any
            if (dto.CourseIds != null && dto.CourseIds.Any())
            {
                teacher.CourseAssignments = dto.CourseIds.Select(courseId =>
                    new CourseAssignment { CourseId = courseId }
                ).ToList();
            }

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Teacher profile created successfully.",
                teacher.TeacherId
            });
        }

        // ✅ Update teacher (Admin)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, [FromBody] TeacherDto dto)
        {
            var teacher = await _context.Teachers
                .Include(t => t.CourseAssignments)
                .FirstOrDefaultAsync(t => t.TeacherId == id);

            if (teacher == null)
                return NotFound("Teacher not found.");

            teacher.RegNo = dto.RegNo;
            teacher.FirstName = dto.FirstName;
            teacher.LastName = dto.LastName;
            teacher.EmployeeNumber = dto.EmployeeNumber;
            teacher.PhoneNumber = dto.PhoneNumber;
            teacher.Username = dto.Username;
            teacher.UserId = dto.UserId;

            // ✅ Update courses
            teacher.CourseAssignments.Clear();
            if (dto.CourseIds != null && dto.CourseIds.Any())
            {
                foreach (var courseId in dto.CourseIds)
                {
                    teacher.CourseAssignments.Add(new CourseAssignment
                    {
                        TeacherId = teacher.TeacherId,
                        CourseId = courseId
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Teacher updated successfully." });
        }

        // ✅ Delete teacher (Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.CourseAssignments)
                .FirstOrDefaultAsync(t => t.TeacherId == id);

            if (teacher == null)
                return NotFound("Teacher not found.");

            if (teacher.CourseAssignments.Any())
                _context.CourseAssignments.RemoveRange(teacher.CourseAssignments);

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Teacher deleted successfully." });
        }

        // ✅ View own courses (Teacher)
        [Authorize(Roles = "Teacher")]
        [HttpGet("my-courses")]
        public async Task<IActionResult> ViewOwnCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var teacher = await _context.Teachers
                .Include(t => t.CourseAssignments)
                    .ThenInclude(ca => ca.Course)
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null)
                return NotFound($"Teacher not found for UserId '{userId}'.");

            var courses = teacher.CourseAssignments.Select(ca => new
            {
                ca.CourseId,
                ca.Course.CourseName,
                ca.Course.CourseDescription
            });

            return Ok(courses);
        }

        // ✅ View students in a course (Teacher)
        [Authorize(Roles = "Teacher")]
        [HttpGet("enrolled-students/{courseId}")]
        public async Task<IActionResult> ViewEnrolledStudents(int courseId)
        {
            var students = await _context.StudentCourses
                .Where(sc => sc.CourseId == courseId)
                .Include(sc => sc.Student)
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

        // ✅ View own profile (Teacher)
        [Authorize(Roles = "Teacher")]
        [HttpGet("my-profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null)
                return NotFound("Teacher not found.");

            return Ok(new
            {
                teacher.RegNo,
                teacher.FirstName,
                teacher.LastName,
                teacher.EmployeeNumber,
                teacher.PhoneNumber,
                teacher.Username,
                teacher.UserId
            });
        }

        // ✅ Assign courses (Admin)
        [Authorize(Roles = "Admin")]
        [HttpPost("assign-course")]
        public async Task<IActionResult> AssignCoursesToTeacher([FromBody] AssignTeacherCourseDto dto)
        {
            var teacher = await _context.Teachers
                .Include(t => t.CourseAssignments)
                .FirstOrDefaultAsync(t => t.TeacherId == dto.TeacherId);

            if (teacher == null)
                return NotFound("Teacher not found.");

            teacher.CourseAssignments.Clear();
            foreach (var courseId in dto.CourseIds)
            {
                teacher.CourseAssignments.Add(new CourseAssignment
                {
                    TeacherId = teacher.TeacherId,
                    CourseId = courseId
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Courses assigned to teacher successfully." });
        }
    }
}
