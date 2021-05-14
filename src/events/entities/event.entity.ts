import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop()
  type: string;

  @Prop({ index: true })
  name: string;

  @Prop({ type: Object })
  payload: Record<string, string>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ name: 1, type: -1 });
