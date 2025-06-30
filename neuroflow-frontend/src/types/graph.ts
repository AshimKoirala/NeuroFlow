export interface UINode {
    id:string;
    label:string;
    rank?: number;
    x?:number;
    y?:number;
    fx?:number | null;
    fy?:number | null;
}

export interface UIEdge {
    id: string;
    from: UINode;
    to: UINode;
    weight: number;
}

