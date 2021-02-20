using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Class for ball's movement controlling.
public class GyroController : MonoBehaviour
{
    public float Speed; // Ball's speed
    private Rigidbody Rb; //Ball's rigidbody
    private void Start()
    {  
        this.Rb = GetComponent<Rigidbody>();
    }
    // FixedUpdate is called before performing any physics calculations
    private void FixedUpdate()
    {
        // Changes ball's movement using Input.acceleration.
        // Input.acceleration : "Last measured linear acceleration of a device in three-dimensional space"
        Vector3 Movement = new Vector3(Input.acceleration.x, 0, -Input.acceleration.z);
        this.Rb.AddForce(Movement * Speed * Time.deltaTime); 
    }
    // Hides pick up elements on collosion.
    private void OnTriggerEnter(Collider other)
    {
        if(other.gameObject.CompareTag("PickUp"))
        {
            other.gameObject.SetActive(false);
        }
    }
}
