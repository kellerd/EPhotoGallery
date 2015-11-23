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
            var q = document.URL.split('?')[1];
            if (q != undefined) {
                var qs = q.split('&');
                for (var i = 0; i < qs.length; i++) {
                    hash = qs[i].split('=');
                    vars.push(hash[1]);
                    vars[hash[0]] = hash[1];
                }
            }
            var pid = vars["pid"] ? vars["pid"] : "1";

            var reopenLink = document.getElementById('reopenGallery'), // link to reopen gallery if it is closed
                lastItemIndex, // save what image we were on, reopen at the same image
                galleryOptions = {
                    index: 0,
                    counterEl: false // no slide counter
                },
                gallerySetup = function (gallery) {
                    gallery.listen('close', function () {
                        lastItemIndex = gallery.getCurrentIndex();
                    });
                    gallery.init();
                    if (lastItemIndex) {
                        gallery.goTo(lastItemIndex);
                    }
                    reopenLink.style.display = '';
                };
            var psl = new PhotoSwipeLoad.PhotoSwipeLoad(pid, galleryOptions, gallerySetup);
            reopenLink.addEventListener('click', function () { psl.initGalleryWithCallback(gallerySetup); });
        };
    }
}
new PhotoSwipeRun.PhotoSwipeRun();