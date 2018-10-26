/**
 * 多资源并行加载。抛弃重的egret RES管理系统。
 */
export default class ImagesLoader extends egret.EventDispatcher {
    private _urls: string[];
    private _textureHash: { [key: string]: egret.Texture };
    private _counter = 0;
    load(urls: string[]) {
        this._urls = urls;
        this._textureHash = {};
        urls.forEach(url => {
            const loader = new egret.ImageLoader();
            loader.load(url);
            loader.once(egret.Event.COMPLETE, this.onImageLoad.bind(this, url), this);
        });
    }

    onImageLoad(url: string, e: egret.Event) {
        this._counter++;
        var loader = e.currentTarget as egret.ImageLoader;
        var bmd = loader.data as egret.BitmapData;
        var texture = new egret.Texture();
        texture._setBitmapData(bmd);
        this._textureHash[url] = texture;
        if (this._counter == this._urls.length)
            this.onAllComplete();
    }

    onAllComplete() {
        const data = this._urls.map(url => this._textureHash[url]);
        const event = new egret.Event(egret.Event.COMPLETE, false, false, data);
        this.dispatchEvent(event);
    }
}