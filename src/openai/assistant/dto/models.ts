export class  AssistantCreate {
  name: string;
  instructions: string;
  tools: Tool[];
  model: string;
}
export class  Tool {
  type: string;
}

export class Thread {
  id: string;
  object: string;
  created_at: number;
  metadata: Metadata;
}

export class MetadataItem {
  key: string;
  value: string;
}

export class Metadata {
    items: MetadataItem[]
}

export class  Message {
  id: string;
  object: string;
  created_at: number;
  thread_id: string;
  role: string;
  content: Content[];
  file_ids: any[];
  assistant_id?: any;
  run_id?: any;
  metadata: Metadata;
}
export class  Content {
  type: string;
  text: Text;
}
export class  Text {
  value: string;
  annotations: any[];
}



export class AssistantFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}