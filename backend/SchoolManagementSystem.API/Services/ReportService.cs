using Microsoft.EntityFrameworkCore;
using SchoolManagementSystem.API.Data;
using SchoolManagementSystem.API.Models.DTOs;

namespace SchoolManagementSystem.API.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReportEntryDto>> GenerateReportAsync(ReportFilterDto filter)
        {
            var query = _context.Grades
                .Include(g => g.Student)
                .Include(g => g.Course)
                .AsQueryable();

            // Filter by FirstName/LastName if provided
            if (!string.IsNullOrEmpty(filter.FullName))
            {
                query = query.Where(g => (g.Student.FirstName + " " + g.Student.LastName).Contains(filter.FullName));
            }

            // Filter by CourseName if provided
            if (!string.IsNullOrEmpty(filter.CourseName))
            {
                query = query.Where(g => g.Course.CourseName.Contains(filter.CourseName)); // Corrected to use CourseName
            }

            // Filter by StartDate if provided
            if (filter.StartDate.HasValue)
            {
                query = query.Where(g => g.EnrollmentDate >= filter.StartDate.Value);
            }

            // Filter by EndDate if provided
            if (filter.EndDate.HasValue)
            {
                query = query.Where(g => g.EnrollmentDate <= filter.EndDate.Value);
            }

            // Select the necessary fields for the report
            return await query.Select(g => new ReportEntryDto
            {
                FirstName = g.Student.FirstName,
                LastName = g.Student.LastName,
                CourseName = g.Course.CourseName, // Corrected to use CourseName
                Test1 = g.Test1,
                Test2 = g.Test2,
                FinalGrade = g.FinalGrade,
                Status = "N/A", // Optional: replace with actual attendance status if available
                EnrollmentDate = g.EnrollmentDate
            }).ToListAsync();
        }
    }
}
