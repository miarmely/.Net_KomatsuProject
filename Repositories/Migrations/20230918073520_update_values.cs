using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class update_values : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)6);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)1,
                column: "SubCategoryName",
                value: "Paletli Ekskavatörler");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)2,
                column: "SubCategoryName",
                value: "Lastikli Yükleyiciler");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)3,
                column: "SubCategoryName",
                value: "Greyderler");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)4,
                column: "SubCategoryName",
                value: "Dozerler");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "MainCategoryId", "SubCategoryName" },
                values: new object[] { (short)5, (byte)1, "Kazıcı Yükleyiciler" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)5);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)1,
                column: "SubCategoryName",
                value: "Paletli Ekskavatör");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)2,
                column: "SubCategoryName",
                value: "Lastikli Ekskavatör");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)3,
                column: "SubCategoryName",
                value: "Lastikli Yükleyici");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: (short)4,
                column: "SubCategoryName",
                value: "Dozer");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "MainCategoryId", "SubCategoryName" },
                values: new object[] { (short)6, (byte)1, "Kaya Kamyonu" });
        }
    }
}
