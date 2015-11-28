using PhotoLibrary;
using System.Collections.Generic;

namespace Models
{
    public class PhotoLibrary
    {
        public IEnumerable<PhotoInfo> photos {
            get; set; }

        public int PageNumber { get; internal set; }
    }
}