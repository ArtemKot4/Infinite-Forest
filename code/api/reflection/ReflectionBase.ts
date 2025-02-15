class ReflectionBase {
    public name: string;
    public page: string;
    public section: string; 
    public max_attempts: number;

    public constructor(name: string, page: string, section: string, max_attempts: number) {
        this.name = name;
        this.page = page;
        this.section = section || "default";
        this.max_attempts = max_attempts || 5;
    };
};