import java.util.Scanner;
public class Person {

    private String name="Mario Montero";
    private Integer edad = 22;
    static Scanner sc = new Scanner(System.in);

    public void Saludar(){
        System.out.println("Estas hablando con:" + this.getName() + "tienes" + this.getEdad() + "años");
    }

    private String getName() {
        return name;
    }

    private Integer getEdad(){
        return edad;
    }
}
