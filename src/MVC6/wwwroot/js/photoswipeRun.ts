'use strict'
module PhotoSwipeRun {
    export class PhotoSwipeRun {
        public constructor() {
            if (document.readyState != 'loading') {
                this.onload();
            }
            else {
                document.addEventListener('DOMContentLoaded', this.onload);
            }
        }

        onload = () => {

            var vars = [], hash;
            var q = document.URL.split('#')[1];
            if (q != undefined) {
                var qs = q.split('&');
                for (var i = 0; i < qs.length; i++) {
                    hash = qs[i].split('=');
                    vars.push(hash[1]);
                    vars[hash[0]] = hash[1];
                }
            }
            var gid = vars["gid"] ? vars["gid"] : "1";

            var galleryOptions = {
                    index: 0,
                    counterEl: false // no slide counter
                },
                gallerySetup =
                   function (gallery) {
                    gallery.init();
                };
            var psl = new PhotoSwipeLoad.PhotoSwipeLoad(gid, galleryOptions, gallerySetup);

            
        };
    }
}
new PhotoSwipeRun.PhotoSwipeRun();