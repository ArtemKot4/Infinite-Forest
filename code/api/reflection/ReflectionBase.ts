class ReflectionBase {
    public name: string;
    public page: string;
    public section: string; 
    public maxAttempts: number;

    public constructor(name: string, page: string, section: string, maxAttempts: number) {
        this.name = name;
        this.page = page;
        this.section = section || "default";
        this.maxAttempts = maxAttempts || 5;
    };
};