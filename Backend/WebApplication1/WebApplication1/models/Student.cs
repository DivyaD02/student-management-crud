namespace MyApi.Models
{
    public class Student
    {
        public int StudentId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public int Age { get; set; }
    }
}
