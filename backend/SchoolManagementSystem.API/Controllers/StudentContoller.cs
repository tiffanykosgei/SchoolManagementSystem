using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models.DTOs;
using SchoolManagementSystem.API.Models.Entities;

namespace SchoolManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ CREATE
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] StudentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var student = new Student
            {
                RegNo = dto.RegNo,
                AdmissionNumber = dto.AdmissionNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Username = dto.Username,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                DoB = dto.DoB,
                EnrollmentDate = dto.EnrollmentDate,
                UserId = dto.UserId,
                ParentId = dto.ParentId
            };

            if (dto.CourseIds != null && dto.CourseIds.Any())
            {
                student.StudentCourses = dto.CourseIds.Select(cid => new StudentCourse
                {
                    CourseId = cid
                }).ToList();
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student created successfully." });
        }

        // ✅ READ (all)
        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.StudentCourses)
                .ThenInclude(sc => sc.Course)
                .Include(s => s.Parent)
                .Select(s => new
                {
                    s.StudentId,
                    s.RegNo,
                    s.AdmissionNumber,
                    s.FirstName,
                    s.LastName,
                    s.Username,
                    s.Email,
                    s.PhoneNumber,
                    s.DoB,
                    s.EnrollmentDate,
                    s.UserId,
                    s.ParentId,
                    ParentName = s.Parent != null ? s.Parent.FirstName + " " + s.Parent.LastName : null,
                    CourseIds = s.StudentCourses.Select(sc => sc.CourseId).ToList(),
                    CourseNames = s.StudentCourses.Select(sc => sc.Course.CourseName).ToList()
                })
                .ToListAsync();

            return Ok(students);
        }

        // ✅ UPDATE
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditStudent(int id, [FromBody] StudentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var student = await _context.Students
                .Include(s => s.StudentCourses)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null) return NotFound("Student not found");

            student.RegNo = dto.RegNo;
            student.AdmissionNumber = dto.AdmissionNumber;
            student.FirstName = dto.FirstName;
            student.LastName = dto.LastName;
            student.Username = dto.Username;
            student.Email = dto.Email;
            student.PhoneNumber = dto.PhoneNumber;
            student.DoB = dto.DoB;
            student.EnrollmentDate = dto.EnrollmentDate;
            student.UserId = dto.UserId;
            student.ParentId = dto.ParentId;

            // update courses
            student.StudentCourses.Clear();
            if (dto.CourseIds != null && dto.CourseIds.Any())
            {
                student.StudentCourses = dto.CourseIds.Select(cid => new StudentCourse
                {
                    StudentId = student.StudentId,
                    CourseId = cid
                }).ToList();
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Student updated successfully." });
        }

        // ✅ DELETE
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.StudentCourses)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null) return NotFound("Student not found");

            if (student.StudentCourses.Any())
                _context.StudentCourses.RemoveRange(student.StudentCourses);

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student deleted successfully." });
        }
    }
}
