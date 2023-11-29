namespace Entities.DtoModels.SliderDtos
{
    public record SliderDtoForMultipleDelete
    {
        public List<string> FileNamesToBeNotDelete { get; init; }

        public override string ToString() =>
            string.Join(",", FileNamesToBeNotDelete);
    }
}
