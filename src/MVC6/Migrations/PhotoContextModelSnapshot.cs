using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using BatchUpdateNicePhotoGallery;

namespace MVC6.Migrations
{
    [DbContext(typeof(PhotoContext))]
    partial class PhotoContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-rc1-16348")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("BatchUpdateNicePhotoGallery.PhotoInfo", b =>
                {
                    b.Property<string>("uri");

                    b.Property<DateTime>("date");

                    b.Property<decimal>("heightRatio");

                    b.Property<int>("rating");

                    b.Property<string>("tags");

                    b.HasKey("uri");
                });
        }
    }
}
