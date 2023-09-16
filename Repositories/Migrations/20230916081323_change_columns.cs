using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class change_columns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSecondHand",
                table: "Machines");

            migrationBuilder.AddColumn<byte>(
                name: "HandStatus",
                table: "Machines",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HandStatus",
                table: "Machines");

            migrationBuilder.AddColumn<bool>(
                name: "IsSecondHand",
                table: "Machines",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
