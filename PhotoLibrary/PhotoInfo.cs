using System;
using Microsoft.Data.Entity;

namespace BatchUpdateNicePhotoGallery
{
    public class PhotoContext : DbContext
    {
        public DbSet<PhotoInfo> PhotoInfos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Make Blog.Url required
            modelBuilder.Entity<PhotoInfo>()
                .Property(b => b.date)
                .IsRequired();

            modelBuilder.Entity<PhotoInfo>().HasKey(p => p.uri);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=EKellerPhotos;Trusted_Connection=True;");
        }

    }
    public class PhotoInfo
    {
        public const string baseuri = @"https://keller.blob.core.windows.net/pictures/";
        public string uri { get; set; }
        public int rating { get; set; }
        public string tags { get; set; }
        public DateTime date { get; set; }
        public decimal heightRatio { get; set; }
    }
}