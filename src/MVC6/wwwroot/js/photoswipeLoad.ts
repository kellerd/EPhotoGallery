/// <reference path="../lib/photoswipe.d.ts" />
/// <reference path="../lib/jquery.d.ts" />
'use strict'
module PhotoSwipeLoad {
    export class PhotoSwipeLoad {
        constructor(public apiKey, public photosetId, public galleryOptions, public callback) {
        }
        flickrData : PhotoSwipe.Item[];
        gallery : PhotoSwipe<any>;

        flickrPhotoSizes = {
            240: 'm',
            320: 'n',
            640: 'z',
            800: 'c',
            1024: 'b',
            1600: 'h',
            2048: 'k',
            2400: 'o' // do not comment this out.
        };
        currentSize = parseInt(Object.keys(this.flickrPhotoSizes)[0], 10); //start with smallest size
        firstResize = true;


        xhr(url, callbackFn) {
            var fnName = 'callback' + Math.floor(Math.random() * 1000001),
                script = document.createElement('script');
            callbackFn = callbackFn || function () { };
            window[fnName] = function (result) { callbackFn(result); };
            script.src = url + '&jsoncallback=' + fnName;
            document.getElementsByTagName('head')[0].appendChild(script);
        };


        initGalleryWithCallback(callback) {
            callback = callback || function () { };
            if (!this.flickrData || !this.galleryOptions) {
                return 'You have to initialize everything.';
            }

            if (!this.gallery) {
                this.initGallery(this.flickrData, this.galleryOptions);
            }

            callback(this.gallery);
        }


        initGallery(data, galleryOptions) {
            // Initializes and opens PhotoSwipe
            var pswpElement = <HTMLElement>document.querySelectorAll('.pswp')[0];
            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, data, galleryOptions);

            // beforeResize event fires each time size of gallery viewport updates
            gallery.listen('beforeResize', function () {
                // gallery.viewportSize.x - width of PhotoSwipe viewport
                // gallery.viewportSize.y - height of PhotoSwipe viewport
                // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
                //                          1 (regular display), 2 (@2x, retina) ...

                var newSize = 0;
                var imageSrcWillChange = false;
                var realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio; // calculate real pixels when size changes


                for (var size in this.flickrPhotoSizes) {
                    if (realViewportWidth > size) {
                        newSize = parseInt(size, 10);
                    }
                }

                if (this.currentSize < newSize) {
                    imageSrcWillChange = true;
                    this.currentSize = newSize;
                }

                // Invalidate items only when source is changed and when it's not the first update
                if (imageSrcWillChange && !this.firstResize) {
                    // invalidateCurrItems sets a flag on slides that are in DOM, which will force update of content (image) on window.resize.
                    gallery.invalidateCurrItems();
                }

                this.firstResize = false;
            });


            // gettingData event fires each time PhotoSwipe retrieves image source & size
            gallery.listen('gettingData', function (index, item) {

                // Set image source & size based on real viewport width
                var ext = this.flickrPhotoSizes[this.currentSize];
                item.src = item.sizeData[ext].src || item['o'].src;
                item.w = item.sizeData[ext].w || item['o'].w;
                item.h = item.sizeData[ext].h || item['o'].h;

                // It doesn't really matter what will you do here, as long as item.src, item.w and item.h have valid values.
                //
                // Just avoid http requests in this listener, as it fires quite often
            });

            gallery.listen('destroy', function () {
                this.gallery = undefined;
            });

            this.gallery = gallery;
        };




        init (apiKey, photosetId, galleryOptions, callback) {
            var sizes = this.flickrPhotoSizes;

            this.galleryOptions = galleryOptions || {};

            if (!('getImageURLForShare' in this.galleryOptions)) {
                this.galleryOptions.getImageURLForShare = function (shareButtonData) {
                    return this.gallery.currItem.original_src || this.gallery.currItem.src || '';
                };
            }

            callback = callback || function () { };

            if (this.flickrData) {
                this.initGallery(this.flickrData, this.galleryOptions);
                callback(this.gallery);
            }
            else {
                var sizeParams = Object.keys(sizes).map(function (size) { return 'url_' + sizes[size]; }).join(','),
                    url = 'https://api.flickr.com/services/rest?method=flickr.photosets.getPhotos&api_key=' + apiKey + '&photoset_id=' +
                        photosetId + '&extras=' + sizeParams + '&format=json';

                this.xhr(url, function (data) {
                    var i
                    var items : Array<PhotoSwipe.Item> = [];

                    for (i in data.photoset.photo) {
                        var photo = data.photoset.photo[i];
                        var item: PhotoSwipe.Item = { src:"", w:0,h:0,sizeData : {} };
                        var size, ext;
                        for (size in sizes) {
                            ext = sizes[size];
                            item.sizeData[ext] = {
                                src: photo['url_' + ext],
                                w: photo['width_' + ext] / 2,
                                h: photo['height_' + ext] * data.photoset.photo[i].ratio,
                            }
                            item.original_src = photo.url_o;
                        }
                        items.push(item);
                    };

                    this.flickrData = items;

                    this.initGallery(this.flickrData, this.galleryOptions);
                    callback(this.gallery);
                });
            }
        };
    };
}
