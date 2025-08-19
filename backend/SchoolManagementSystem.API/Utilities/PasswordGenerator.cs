namespace SchoolManagementSystem.API.Utilities
{
    public static class PasswordGenerator
    {
        public static string GenerateSecureTempPassword()
        {
            const string valid = "Temp@123!";
            Random random = new();
            return new string(Enumerable.Repeat(valid, 10)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
