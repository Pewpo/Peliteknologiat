using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//This class rotates pick up objects.
public class PickUpRotator : MonoBehaviour
{
    // Update is called once per frame
    void Update()
    {
        transform.Rotate(new Vector3(15, 30, 34) * Time.deltaTime);  
    }
}
