namespace Entities.DtoModels.SliderDtos
{
    public record SliderDtoForDeleteMultiple
    {
        public List<string> FileNamesToBeNotDelete { get; init; }

        public override string ToString() =>
            string.Join(",", FileNamesToBeNotDelete);
    }
}
