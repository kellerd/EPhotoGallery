using PhotoLibrary;
using System;
using System.IO;
using System.Linq;

namespace BatchUpdateNicePhotoGallery
{
    class Program
    {
        private const string endRdfLi = "</rdf:li>";
        private const string rdfLi = "<rdf:li>";
        private const string xmpRating = "xmp:Rating=\"";
        private const string Elizabeth = @"Elizabeth\";
        private const string path = @"C:\Users\Dan\Pictures\";

        static void Main(string[] args)
        {
            var len = path.Length;
            var fileSystemItems = Directory.EnumerateFiles(Path.Combine(path, Elizabeth), "o_*", SearchOption.AllDirectories).AsParallel().Take(1).Select(f =>
            {
                var text = File.ReadAllText(f.Replace("o_", ""));
                var sourceDirectoryLength = path.Length + Elizabeth.Length;
                var year = string.Concat(f.Skip(sourceDirectoryLength).Take(4));
                var month = string.Concat(f.Skip(sourceDirectoryLength + 5).TakeWhile(ch => ch != Convert.ToChar(@"\")));
                DateTime date;
                if (!DateTime.TryParseExact(year + "-" + month + "-" + "1", "yyyy-MMMM-d", null, System.Globalization.DateTimeStyles.None, out date))
                    date = DateTime.Now;
                var idx = text.IndexOf(rdfLi);
                string tags = (idx > -1)   
                                        ? text.Substring(idx + rdfLi.Length, text.Substring(idx).IndexOf(endRdfLi) - rdfLi.Length) 
                                        : string.Empty;

                var split2 = text.IndexOf(xmpRating);
                int rating = int.Parse(split2 > -1 
                                                    ? text.Substring(split2 + xmpRating.Length, 1) 
                                                    : string.Empty);
                var uri = f.Substring(len);
                var image = System.Drawing.Image.FromFile(f);
                var heightRatio = (decimal)image.Height / (decimal)image.Width;
                return new PhotoInfo { uri = uri, heightRatio = heightRatio, rating = rating, tags = tags, date = date };
            }).ToDictionary(p=>p.uri);
            using (PhotoContext context = new PhotoContext())
            {
                var dbItems = context.PhotoInfos.ToDictionary(p => p.uri);
                context.RemoveRange(dbItems.Values.Where( p =>!fileSystemItems.ContainsKey(p.uri)));
                foreach (var item in fileSystemItems.Values)
                {
                    PhotoInfo dbItem;
                    if (dbItems.TryGetValue(item.uri, out dbItem))
                    {
                        dbItem.date = item.date;
                        dbItem.rating = item.rating;
                        dbItem.tags = item.tags;
                        dbItem.heightRatio = item.heightRatio;
                        context.Update(dbItem);
                    }
                    else
                    {
                        context.Add(item);
                    }
                }
                context.SaveChanges();
            }
        }
    }
}
