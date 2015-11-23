using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace MVC6.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PhotoInfo",
                columns: table => new
                {
                    uri = table.Column<string>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    ratio = table.Column<decimal>(nullable: false),
                    rating = table.Column<int>(nullable: false),
                    tags = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhotoInfo", x => x.uri);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("PhotoInfo");
        }
    }
}
