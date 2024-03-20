
const green_moon = {
    model () {
        
       const pos = Player.getPosition();
        const mesh = new RenderMesh();
 
        mesh.addVertex(0, 0.75, 0, 0, 0); 
        mesh.addVertex(3.5, 0.75, 0, 3, 0); 
        mesh.addVertex(0, 0.75, 3.5, 0, 1); 
        
        mesh.addVertex(3.5, 0.75, 0, 1, 0); 
        mesh.addVertex(0, 0.75, 3.5, 0, 1); 
        mesh.addVertex(3.5, 0.75, 3.5, 1, 1); 

        mesh.rotate(0, 0, 0, 0, 0, -0.75);
        const animation: Animation.Base = new Animation.Base(pos.x, pos.y + 3, pos.z);
        animation.describe({
            mesh: mesh, skin: "environment/green_moon.png", 
            
        }); 
       
        animation.setIgnoreLightMode()   

        return animation
    }
}