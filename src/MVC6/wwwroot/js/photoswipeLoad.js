/// <reference path="../lib/photoswipe.d.ts" />
/// <reference path="../lib/jquery.d.ts" />
'use strict';
var PhotoSwipeLoad;
(function (PhotoSwipeLoad_1) {
    var PhotoSwipeLoad = (function () {
        function PhotoSwipeLoad(pid, galleryOptions, callback) {
            var _this = this;
            this.pid = pid;
            this.galleryOptions = galleryOptions;
            this.callback = callback;
            this.EphotoGalleryPhotoSizes = {
                240: 'm',
                320: 'n',
                640: 'z',
                800: 'c',
                1024: 'b',
                1600: 'h',
                2048: 'k',
                2400: 'o' // do not comment this out.
            };
            this.currentSize = parseInt(Object.keys(this.EphotoGalleryPhotoSizes)[0], 10); //start with smallest size
            this.firstResize = true;
            this.initGalleryWithCallback = function (callback) {
                callback = callback || function () { };
                if (!_this.EphotoGalleryData || !_this.galleryOptions) {
                    return 'You have to initialize everything.';
                }
                if (!_this.gallery) {
                    _this.initGallery(_this.EphotoGalleryData, _this.galleryOptions);
                }
                callback(_this.gallery);
            };
            this.initGallery = function (data, galleryOptions) {
                // Initializes and opens PhotoSwipe
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, data, galleryOptions);
                // beforeResize event fires each time size of gallery viewport updates
                gallery.listen('beforeResize', function () {
                    // gallery.viewportSize.x - width of PhotoSwipe viewport
                    // gallery.viewportSize.y - height of PhotoSwipe viewport
                    // window.devicePixelRatio - heightRatio between physical pixels and device independent pixels (Number)
                    //                          1 (regular display), 2 (@2x, retina) ...
                    var newSize = 0;
                    var imageSrcWillChange = false;
                    var realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio; // calculate real pixels when size changes
                    for (var size in this.EphotoGalleryPhotoSizes) {
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
                    var ext = this.EphotoGalleryPhotoSizes[this.currentSize];
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
                _this.gallery = gallery;
            };
            this.init = function () {
                var sizes = _this.EphotoGalleryPhotoSizes;
                _this.galleryOptions = _this.galleryOptions || {};
                if (!('getImageURLForShare' in _this.galleryOptions)) {
                    _this.galleryOptions.getImageURLForShare = function (shareButtonData) {
                        return this.gallery.currItem.original_src || this.gallery.currItem.src || '';
                    };
                }
                _this.callback = _this.callback || function () { };
                if (_this.EphotoGalleryData) {
                    _this.initGallery(_this.EphotoGalleryData, _this.galleryOptions);
                    _this.callback(_this.gallery);
                }
                else {
                    var url = "Data/" + (_this.pid || 1).toString();
                    $.get(url, function (data) {
                        var i, items = [];
                        for (i in data) {
                            var photo = data[i];
                            var item = { src: "", w: 0, h: 0, sizeData: {} };
                            var size, ext;
                            for (size in sizes) {
                                ext = sizes[size];
                                var w = photo.heightRatio <= 1 ? parseFloat(size) : parseFloat(size) * photo.heightRatio;
                                var h = photo.heightRatio > 1 ? parseFloat(size) : parseFloat(size) * photo.heightRatio;
                                item.sizeData[ext] = {
                                    src: photo.uri.replace("_o", "_" + ext),
                                    w: w,
                                    h: h,
                                };
                                item.original_src = photo.uri.replace("_o", "");
                            }
                            items.push(item);
                        }
                        ;
                        _this.EphotoGalleryData = items;
                        _this.initGallery(_this.EphotoGalleryData, _this.galleryOptions);
                        _this.callback(_this.gallery);
                    });
                }
            };
            this.init();
        }
        return PhotoSwipeLoad;
    })();
    PhotoSwipeLoad_1.PhotoSwipeLoad = PhotoSwipeLoad;
    ;
})(PhotoSwipeLoad || (PhotoSwipeLoad = {}));
