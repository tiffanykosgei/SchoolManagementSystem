using SchoolManagementSystem.API.Models.DTOs;

namespace SchoolManagementSystem.API.Services
{
    public interface IReportService
    {
        Task<List<ReportEntryDto>> GenerateReportAsync(ReportFilterDto filter);
    }
}
