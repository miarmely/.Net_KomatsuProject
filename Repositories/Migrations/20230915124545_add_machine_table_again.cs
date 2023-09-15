using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repositories.Migrations
{
    /// <inheritdoc />
    public partial class add_machine_table_again : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Machines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BrandId = table.Column<short>(type: "smallint", nullable: false),
                    CategoryId = table.Column<short>(type: "smallint", nullable: false),
                    Model = table.Column<string>(type: "varchar(50)", nullable: false),
                    IsSecondHand = table.Column<bool>(type: "bit", nullable: false),
                    ImagePath = table.Column<string>(type: "varchar(60)", nullable: false),
                    Stock = table.Column<short>(type: "smallint", nullable: false),
                    Rented = table.Column<short>(type: "smallint", nullable: false),
                    Sold = table.Column<short>(type: "smallint", nullable: false),
                    Year = table.Column<short>(type: "smallint", nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Machines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Machines_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Machines_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Machines_BrandId",
                table: "Machines",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Machines_CategoryId",
                table: "Machines",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Machines");
        }
    }
}
