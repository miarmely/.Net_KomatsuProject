using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class Update_tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Machines_MainAndSubCategories_MainAndSubCategoryId",
                table: "Machines");

            migrationBuilder.DropTable(
                name: "MainAndSubCategories");

            migrationBuilder.DropTable(
                name: "SubCategories");

            migrationBuilder.RenameColumn(
                name: "MainAndSubCategoryId",
                table: "Machines",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Machines_MainAndSubCategoryId",
                table: "Machines",
                newName: "IX_Machines_CategoryId");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false)
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

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "MainCategoryId", "SubCategoryName" },
                values: new object[,]
                {
                    { (byte)1, (byte)1, "Paletli Ekskavatörler" },
                    { (byte)2, (byte)1, "Lastikli Yükleyiciler" },
                    { (byte)3, (byte)1, "Greyderler" },
                    { (byte)4, (byte)1, "Dozerler" },
                    { (byte)5, (byte)1, "Kazıcı Yükleyiciler" }
                });

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

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Machines",
                newName: "MainAndSubCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Machines_CategoryId",
                table: "Machines",
                newName: "IX_Machines_MainAndSubCategoryId");

            migrationBuilder.CreateTable(
                name: "SubCategories",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImagePath = table.Column<string>(type: "varchar(60)", nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MainAndSubCategories",
                columns: table => new
                {
                    Id = table.Column<byte>(type: "tinyint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MainCategoryId = table.Column<byte>(type: "tinyint", nullable: false),
                    SubCategoryId = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MainAndSubCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MainAndSubCategories_MainCategories_MainCategoryId",
                        column: x => x.MainCategoryId,
                        principalTable: "MainCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MainAndSubCategories_SubCategories_SubCategoryId",
                        column: x => x.SubCategoryId,
                        principalTable: "SubCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "SubCategories",
                columns: new[] { "Id", "ImagePath", "Name" },
                values: new object[,]
                {
                    { (byte)1, "/Images/SubCategory/category1.png", "Paletli Ekskavatörler" },
                    { (byte)2, "/Images/SubCategory/category2.png", "Lastikli Yükleyiciler" },
                    { (byte)3, "/Images/SubCategory/category3.png", "Greyderler" },
                    { (byte)4, "/Images/SubCategory/category4.png", "Dozerler" },
                    { (byte)5, "/Images/SubCategory/category5.png", "Kazıcı Yükleyiciler" }
                });

            migrationBuilder.InsertData(
                table: "MainAndSubCategories",
                columns: new[] { "Id", "MainCategoryId", "SubCategoryId" },
                values: new object[,]
                {
                    { (byte)1, (byte)1, (byte)1 },
                    { (byte)2, (byte)1, (byte)2 },
                    { (byte)3, (byte)1, (byte)3 },
                    { (byte)4, (byte)1, (byte)4 },
                    { (byte)5, (byte)1, (byte)5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MainAndSubCategories_MainCategoryId",
                table: "MainAndSubCategories",
                column: "MainCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MainAndSubCategories_SubCategoryId",
                table: "MainAndSubCategories",
                column: "SubCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Machines_MainAndSubCategories_MainAndSubCategoryId",
                table: "Machines",
                column: "MainAndSubCategoryId",
                principalTable: "MainAndSubCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
