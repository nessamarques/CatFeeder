export class CatFeeder { 
    operation_mode: number;
    minutes_between_feeding: number;
    cat_count: number;
    public constructor(init?:Partial<CatFeeder>) {
        Object.assign(this, init);
    }
}