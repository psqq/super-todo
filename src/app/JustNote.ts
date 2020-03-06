import { jsonProperty, Serializable } from "ts-serializable";
import shortid from 'shortid';

export default class JustNote extends Serializable {
  @jsonProperty(String)
  private id: string = "";
  @jsonProperty(String)
  private text: string = "";
  @jsonProperty(Number)
  private createdTime = 0;
  @jsonProperty(Number)
  private updatedTime = 0;

  constructor(s: string) {
    super();
    this.id = shortid();
    this.text = s;
    this.createdTime = Date.now();
    this.updatedTime = Date.now();
  }

  setText(s: string) {
    this.text = s;
    this.updatedTime = Date.now();
  }

  getText() {
    return this.text;
  }
}
