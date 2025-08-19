using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models.Entities;
using SchoolManagementSystem.API.Models.DTOs;
using SchoolManagementSystem.API.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GradeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Assign grade (Teacher)
        [Authorize(Roles = "Teacher")]
        [HttpPost("assign")]
        public async Task<IActionResult> AssignGrade([FromBody] GradeDto dto)
        {
            var grade = new Grade
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                Test1 = dto.Test1,
                Test2 = dto.Test2,
                FinalGrade = dto.FinalGrade,
                DateRecorded = dto.DateRecorded
            };

            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGradeById), new { id = grade.GradeId }, grade);
        }

        // ✅ Edit grade (Teacher)
        [Authorize(Roles = "Teacher")]
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditGrade(int id, [FromBody] GradeDto dto)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return NotFound("Grade not found");

            grade.StudentId = dto.StudentId;
            grade.CourseId = dto.CourseId;
            grade.Test1 = dto.Test1;
            grade.Test2 = dto.Test2;
            grade.FinalGrade = dto.FinalGrade;
            grade.DateRecorded = dto.DateRecorded;

            await _context.SaveChangesAsync();
            return Ok("Grade updated");
        }

        // ✅ Teacher: View grades for their courses
        [Authorize(Roles = "Teacher")]
        [HttpGet("my-course-grades")]
        public async Task<IActionResult> GetGradesForMyCourses()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null) return NotFound("Teacher not found");

            var courseIds = await _context.CourseAssignments
                .Where(ca => ca.TeacherId == teacher.TeacherId)
                .Select(ca => ca.CourseId)
                .ToListAsync();

            var grades = await _context.Grades
                .Where(g => courseIds.Contains(g.CourseId))
                .Select(g => new
                {
                    g.GradeId,
                    g.StudentId,
                    g.CourseId,
                    g.Test1,
                    g.Test2,
                    g.FinalGrade,
                    g.DateRecorded
                })
                .ToListAsync();

            return Ok(grades);
        }

        // ✅ Delete grade (Teacher)
        [Authorize(Roles = "Teacher")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteGrade(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return NotFound("Grade not found");

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();
            return Ok("Grade deleted");
        }

        // ✅ View a specific grade (used for CreatedAtAction)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGradeById(int id)
        {
            var grade = await _context.Grades
                .Include(g => g.Student)
                .Include(g => g.Course)
                .FirstOrDefaultAsync(g => g.GradeId == id);

            if (grade == null) return NotFound();

            return Ok(grade);
        }

        // ✅ Student: View their grades
        [Authorize(Roles = "Student")]
        [HttpGet("my-grades/{studentId}")]
        public IActionResult ViewMyGrades(int studentId)
        {
            var grades = _context.Grades
                .Include(g => g.Course)
                .Where(g => g.StudentId == studentId)
                .ToList();

            return Ok(grades);
        }

        // ✅ Admin: View all grades
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public IActionResult ViewAllGrades()
        {
            var grades = _context.Grades
                .Include(g => g.Student)
                .Include(g => g.Course)
                .ToList();

            return Ok(grades);
        }
    }
}
