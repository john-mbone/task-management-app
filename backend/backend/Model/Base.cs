using System.ComponentModel.DataAnnotations;

namespace backend.Model
{
    public class Base
    {
        [Key]
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedOn { get; set; } = DateTime.UtcNow;

    }
}
