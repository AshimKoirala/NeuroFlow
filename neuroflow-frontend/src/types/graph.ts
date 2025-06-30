export interface UINode extends d3.SimulationNodeDatum{
    id:string;
    label:string;
    x?:number;
    y?:number;
}

export interface UIEdge extends d3.SimulationLinkDatum<UINode>{
    id:string;
    from:UINode;
    to:UINode;
    weight: number;
}

