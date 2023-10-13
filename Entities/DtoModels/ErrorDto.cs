namespace Entities.DtoModels
{
    public class ErrorDto
    {
        public int StatusCode { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorDescription { get; set; }
        public string ErrorMessage { get; set; }
    }
}
