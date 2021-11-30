//Written by Charlie Chiccarine August 2019 for purposes of
//demonstrating Data Simulation for preparation for the Praxis
//computer science exam

import java.util.*;
import java.lang.*;
import java.text.*;

public class ballthrowing
{
	public static void main(String[] args)
	{
		Scanner input = new Scanner(System.in);
		DecimalFormat df = new DecimalFormat("0.000");
		
		//Setting up the simulation
		System.out.println("Ball Throwing Simulation");
		System.out.print("\n Enter throwing velocity (m): ");
		double throwVel = input.nextInt();
		System.out.print("\n Enter angle at which to throw (0-90 degrees): ");
		double angle = input.nextInt();

		double xVel0 = throwVel * Math.cos( angle ),
			   yVel0 = throwVel * Math.sin( angle ),
			   yVel1 = yVel0,
			   grav = -9.8,
			   xPos = 0,
			   yPos = 0,
			   time = 0;


		//Perform the simulation
		System.out.println("Time (s),X Position (m), Y Position(m)");
		while( yPos >= 0 )
		{
			System.out.println(df.format(time) + "," + df.format(xPos) + "," + df.format(yPos) );
			
			yVel1 = yVel0 +  (grav * time);
			yPos = ((yVel0 + yVel1) / 2) * time;

			xPos = (xVel0 * time);

			time += 0.001;
		}	
	}
}
