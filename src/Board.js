export default class Board
{
  constructor(scene, tileWidth, tileHeight)
  {
    this.scene = scene;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  pixel_to_index(point) {
    let x = Math.floor(point.x / this.tileWidth);
    let y = Math.floor(point.y / this.tileHeight);

    return new Phaser.Geom.Point(x, y);
  }

  index_to_pixel(index_point) {
    let x = index_point.x * this.tileWidth;
    let y = index_point.y * this.tileHeight;

    return new Phaser.Geom.Point(x, y);
  }

  x_y_index_to_pixel(index_x, index_y) {
    let x = index_x * this.tileWidth;
    let y = index_y * this.tileHeight;

    return new Phaser.Geom.Point(x, y);
  }

  getTile(tilePosition) {
    return this.scene.map.getTileAt(tilePosition.x, tilePosition.y, false, 'world');
  }

  positionCollides(tilePosition) {
    let tile = this.getTile(tilePosition);
    if (tile == undefined) {
      return false;
    }

    return tile.properties.collides == true;
  }
}
