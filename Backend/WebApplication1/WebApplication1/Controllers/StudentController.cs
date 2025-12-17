using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using MyApi.Models;

namespace MyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IConfiguration _config;

        public StudentsController(IConfiguration config)
        {
            _config = config;
        }

        private string GetConnection()
        {
            return _config.GetConnectionString("StudentCon");
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            List<Student> students = new List<Student>();

            string query = "SELECT StudentId, Name, Email, Age FROM Student";
            using (SqlConnection conn = new SqlConnection(GetConnection()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        students.Add(new Student
                        {
                            StudentId = (int)reader["StudentId"],
                            Name = reader["Name"].ToString(),
                            Email = reader["Email"].ToString(),
                            Age = (int)reader["Age"]
                        });
                    }
                }
            }

            return Ok(students); 
        }


        
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            Student student = null;

            string query = "SELECT StudentId, Name, Email, Age FROM Student WHERE StudentId = @id";
            using (SqlConnection conn = new SqlConnection(GetConnection()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        student = new Student
                        {
                            StudentId = (int)reader["StudentId"],
                            Name = reader["Name"].ToString(),
                            Email = reader["Email"].ToString(),
                            Age = (int)reader["Age"]
                        };
                    }
                }
            }

            if (student == null)
                return NotFound("Student Not Found");

            return Ok(student);
        }


        
        [HttpPost]
        public JsonResult Create(Student s)
        {
            string query = @"INSERT INTO Student (Name, Email, Age)
                             VALUES (@Name, @Email, @Age)";

            using (SqlConnection conn = new SqlConnection(GetConnection()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Name", s.Name);
                cmd.Parameters.AddWithValue("@Email", s.Email);
                cmd.Parameters.AddWithValue("@Age", s.Age);
                cmd.ExecuteNonQuery();
            }

            return new JsonResult("Student Added Successfully");
        }

        [HttpPut("{id}")]
        public JsonResult Update(int id, Student s)
        {
            string query = @"UPDATE Student 
                             SET Name=@Name, Email=@Email, Age=@Age
                             WHERE StudentId=@id";

            using (SqlConnection conn = new SqlConnection(GetConnection()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@Name", s.Name);
                cmd.Parameters.AddWithValue("@Email", s.Email);
                cmd.Parameters.AddWithValue("@Age", s.Age);
                cmd.ExecuteNonQuery();
            }

            return new JsonResult("Student Updated Successfully");
        }

       
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = "DELETE FROM Student WHERE StudentId = @id";

            using (SqlConnection conn = new SqlConnection(GetConnection()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();
            }

            return new JsonResult("Student Deleted Successfully");
        }
    }
}
