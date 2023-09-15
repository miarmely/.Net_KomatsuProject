using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class change_table_columns_and_add_category_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Machines_MainCategories_MainCategoryId",
                table: "Machines");

            migrationBuilder.DropIndex(
                name: "IX_Machines_MainCategoryId",
                table: "Machines");

            migrationBuilder.DropColumn(
                name: "MainCategoryId",
                table: "Machines");

            migrationBuilder.DropColumn(
                name: "SubCategoryName",
                table: "Machines");

            migrationBuilder.AddColumn<short>(
                name: "CategoryId",
                table: "Machines",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MainCategoryId = table.Column<byte>(type: "tinyint", nullable: false),
                    SubCategoryName = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_MainCategories_MainCategoryId",
                        column: x => x.MainCategoryId,
                        principalTable: "MainCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Machines_CategoryId",
                table: "Machines",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_MainCategoryId",
                table: "Categories",
                column: "MainCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Machines_Categories_CategoryId",
                table: "Machines",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Machines_Categories_CategoryId",
                table: "Machines");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Machines_CategoryId",
                table: "Machines");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Machines");

            migrationBuilder.AddColumn<byte>(
                name: "MainCategoryId",
                table: "Machines",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<string>(
                name: "SubCategoryName",
                table: "Machines",
                type: "varchar(50)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Machines_MainCategoryId",
                table: "Machines",
                column: "MainCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Machines_MainCategories_MainCategoryId",
                table: "Machines",
                column: "MainCategoryId",
                principalTable: "MainCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
