using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models.DTOs;
using SchoolManagementSystem.API.Models.Entities;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ParentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Create parent — uses RegNo for ApplicationUser
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateParent([FromBody] ParentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (string.IsNullOrWhiteSpace(dto.RegNo)) return BadRequest("RegNo is required.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.RegNo == dto.RegNo);
            if (user == null) return NotFound($"No user found with RegNo: {dto.RegNo}");

            var existing = await _context.Parents.FirstOrDefaultAsync(p => p.UserId == user.Id);
            if (existing != null) return BadRequest("This user is already assigned as a Parent.");

            // Optional: update User Email / Phone if needed
            user.Email = dto.Email ?? user.Email;
            user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;

            var parent = new Parent
            {
                RegNo = dto.RegNo,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                PhoneNumber = dto.PhoneNumber,
                UserId = user.Id,
                Email = dto.Email
            };

            _context.Parents.Add(parent);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Parent created successfully.", parentId = parent.ParentId });
        }

        // ✅ Edit parent
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditParent(int id, [FromBody] ParentDto dto)
        {
            var parent = await _context.Parents
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.ParentId == id);

            if (parent == null) return NotFound("Parent not found.");

            parent.FirstName = dto.FirstName;
            parent.LastName = dto.LastName;
            parent.PhoneNumber = dto.PhoneNumber;

            // Optionally update User info
            if (parent.User != null)
            {
                parent.User.Email = dto.Email ?? parent.User.Email;
                parent.User.PhoneNumber = dto.PhoneNumber ?? parent.User.PhoneNumber;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Parent updated successfully." });
        }

        // ✅ Delete parent
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteParent(int id)
        {
            var parent = await _context.Parents.FindAsync(id);
            if (parent == null) return NotFound("Parent not found.");

            _context.Parents.Remove(parent);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Parent deleted successfully." });
        }

        // ✅ Get all parents — includes RegNo, Username, Email, PhoneNumber
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllParents()
        {
            var parents = await _context.Parents
                .Include(p => p.User)
                .Select(p => new
                {
                    p.ParentId,
                    p.User.RegNo,
                    Username = p.User.UserName,
                    Email = p.User.Email,
                    PhoneNumber = p.User.PhoneNumber,
                    p.FirstName,
                    p.LastName,
                    UserId = p.User.Id
                })
                .ToListAsync();

            return Ok(parents);
        }

        // ✅ View child profile + courses
        [HttpGet("child-profile/{childId}")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> ViewChildProfile(int childId)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .Include(s => s.StudentCourses)
                    .ThenInclude(sc => sc.Course)
                .FirstOrDefaultAsync(s => s.StudentId == childId);

            if (student == null) return NotFound("Child not found.");

            return Ok(new
            {
                student.StudentId,
                student.AdmissionNumber,
                student.DoB,
                student.PhoneNumber,
                student.User.FirstName,
                student.User.LastName,
                Courses = student.StudentCourses.Select(sc => new
                {
                    sc.Course.CourseId,
                    sc.Course.CourseName
                })
            });
        }

        // ✅ View child grades
        [HttpGet("child-grades/{childId}")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> ViewChildGrades(int childId)
        {
            var grades = await _context.Grades
                .Where(g => g.StudentId == childId)
                .Include(g => g.Course)
                .ToListAsync();

            if (!grades.Any()) return NotFound("No grades found for the child.");

            var result = grades.Select(g => new
            {
                g.GradeId,
                g.Test1,
                g.Test2,
                g.FinalGrade,
                g.Term,
                CourseName = g.Course.CourseName
            });

            return Ok(result);
        }

        // ✅ View child courses
        [HttpGet("child-courses/{childId}")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> ViewChildCourses(int childId)
        {
            var courses = await _context.StudentCourses
                .Where(sc => sc.StudentId == childId)
                .Include(sc => sc.Course)
                .Select(sc => new
                {
                    sc.Course.CourseId,
                    sc.Course.CourseName
                }).ToListAsync();

            if (!courses.Any()) return NotFound("No courses found for the child.");
            return Ok(courses);
        }

        // ✅ View child attendance
        [HttpGet("child-attendance/{childId}")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> ViewChildAttendance(int childId)
        {
            var attendance = await _context.Attendance
                .Where(a => a.StudentId == childId)
                .ToListAsync();

            if (!attendance.Any()) return NotFound("No attendance records found.");
            return Ok(attendance);
        }

        // ✅ Message staff
        [HttpPost("message-staff")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content)) return BadRequest("Message content cannot be empty.");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var parent = await _context.Parents.FirstOrDefaultAsync(p => p.UserId == userId);
            if (parent == null) return Unauthorized("Parent not found.");

            var message = new Message
            {
                ParentId = parent.ParentId,
                Content = dto.Content
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Message sent successfully." });
        }
    }
}
