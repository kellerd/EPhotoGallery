'use strict'
module PhotoSwipeRun {
    export class PhotoSwipeRun {
        public constructor() {
            if (document.readyState != 'loading') {
                this.onload();
            }
            else {
                document.addEventListener('DOMContentLoaded', onload);
            }
        }

        onload = () => {
            var flickrApiKey = 'FILL-ME-IN',
                flickrPhotosetId = 'FILL-ME-IN',
                reopenLink = document.getElementById('reopenGallery'), // link to reopen gallery if it is closed
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
            var psl = new PhotoSwipeLoad.PhotoSwipeLoad(flickrApiKey, flickrPhotosetId, galleryOptions, gallerySetup);
            reopenLink.addEventListener('click', function () { psl.initGalleryWithCallback(gallerySetup); });
        };
    }
}
new PhotoSwipeRun.PhotoSwipeRun();