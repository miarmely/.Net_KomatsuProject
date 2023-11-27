namespace Entities.ConfigModels
{
    public record ErrorMessagesConfig
    {
        public ErrorDetails NF_S_FP { get; init; }
    }

    public record ErrorDetails
    {
        public int StatusCode { get; init; }
        public string ErrorCode { get; init; }
        public string ErrorDescription { get; init; }
        public Languages ErrorMessage { get; init; }
    }

    public record Languages(
        string TR, 
        string EN);
}
