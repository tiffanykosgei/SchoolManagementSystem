using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models.DTOs;
using SchoolManagementSystem.API.Models.Entities;
using SchoolManagementSystem.API.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ TEACHER: Mark attendance
        [Authorize(Roles = "Teacher")]
        [HttpPost("mark")]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceDto dto)
        {
            var attendance = new Attendance
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                Status = dto.Status,
                DateRecorded = dto.DateRecorded
            };

            _context.Attendance.Add(attendance);
            await _context.SaveChangesAsync();

            return Ok("Attendance marked");
        }

        // ✅ TEACHER: Edit attendance record
        [Authorize(Roles = "Teacher")]
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditAttendance(int id, [FromBody] AttendanceDto dto)
        {
            var record = await _context.Attendance.FindAsync(id);
            if (record == null) return NotFound("Attendance record not found");

            record.Status = dto.Status;
            record.DateRecorded = dto.DateRecorded;
            record.CourseId = dto.CourseId;
            record.StudentId = dto.StudentId;

            await _context.SaveChangesAsync();
            return Ok("Attendance updated");
        }

        // ✅ TEACHER: View attendance for a specific course with student details
        [Authorize(Roles = "Teacher")]
        [HttpGet("my-course-attendance")]
        public async Task<IActionResult> GetAttendanceForMyCourses([FromQuery] int courseId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (teacher == null) return NotFound("Teacher not found");

            // Check if the teacher is assigned to this course
            var isAssigned = await _context.CourseAssignments
                .AnyAsync(ca => ca.TeacherId == teacher.TeacherId && ca.CourseId == courseId);

            if (!isAssigned) return Forbid("You are not assigned to this course.");

            var attendanceRecords = await _context.Attendance
                .Where(a => a.CourseId == courseId)
                .Include(a => a.Student)
                .Select(a => new
                {
                    a.AttendanceId,
                    StudentName = a.Student.FirstName,
                 //   StudentName = a.Student.LastName,
                    AdmissionNumber = a.Student.AdmissionNumber,
                    a.Status,
                    a.DateRecorded
                })
                .ToListAsync();

            return Ok(attendanceRecords);
        }

        // ✅ STUDENT: View their own attendance
        [Authorize(Roles = "Student")]
        [HttpGet("my/{studentId}")]
        public async Task<IActionResult> ViewOwnAttendance(int studentId)
        {
            var records = await _context.Attendance
                .Where(a => a.StudentId == studentId)
                .Include(a => a.Course)
                .ToListAsync();

            return Ok(records);
        }

        // ✅ PARENT: View child’s attendance (limited fields)
        [Authorize(Roles = "Parent")]
        [HttpGet("child/{childId}")]
        public async Task<IActionResult> ViewChildAttendance(int childId)
        {
            var records = await _context.Attendance
                .Where(a => a.StudentId == childId)
                .Include(a => a.Student)
                .Select(a => new
                {
                    StudentName = a.Student.FirstName + " " + a.Student.LastName,
                    AdmissionNumber = a.Student.AdmissionNumber,
                    a.Status,
                    a.DateRecorded
                })
                .ToListAsync();

            return Ok(records);
        }

        // ✅ ADMIN: Audit all attendance
        [Authorize(Roles = "Admin")]
        [HttpGet("audit")]
        public async Task<IActionResult> AuditAllAttendance()
        {
            var allRecords = await _context.Attendance
                .Include(a => a.Student)
                .Include(a => a.Course)
                .ToListAsync();

            return Ok(allRecords);
        }
    }
}
