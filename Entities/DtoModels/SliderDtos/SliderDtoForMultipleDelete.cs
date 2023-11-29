namespace Entities.DtoModels.SliderDtos
{
    public record SliderDtoForDelete
    {
        public List<string> FileNamesToBeNotDelete { get; init; }

        public override string ToString() =>
            string.Join(",", FileNamesToBeNotDelete);
    }
}
