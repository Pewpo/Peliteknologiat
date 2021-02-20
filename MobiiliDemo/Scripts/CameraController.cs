using System.Collections;
using System.Collections.Generic;
using UnityEngine;
//Class for camera controlling.
public class CameraController : MonoBehaviour
{
    public GameObject Player;
    private Vector3 Offset;
    // Start is called before the first frame update
    void Start()
    {
        this.Offset = transform.position - this.Player.transform.position;
    }
    // LateUpdate is called once per frame but after update's actions has performed.
    void LateUpdate()
    {
        transform.position = this.Player.transform.position + this.Offset;
    }
}
