extends "res://src/actors/Actor.gd"

var speed: = Vector2(10000.0,10000.0)
var direction: Vector2
var enemyscore: = 0
var ownscore: = 0

func _ready() -> void:
	direction = Vector2(-1.0, 1.0)

#Ball's collosion handling when hits Player or Enemy.
func _on_Area2D_body_entered(body: PhysicsBody2D) -> void:
	if body.name == "Player" || body.name == "Enemy":	
		direction.y *= -1.0
		direction.x *= -1.0

#Ball's collosion handling when hits goal.	
func _on_Area2D_area_shape_entered(area_id, area, area_shape, self_shape):
	if area.name == "EnemyGoal":
		ownscore += 1
	else:
		enemyscore += 1	
	direction.y *= -1.3
	direction.x *= -1.3
	#Write scores to label
	get_node("Control/OwnScore").set_score(ownscore) 
	get_node("Control/EnemyScore").set_score(enemyscore)

#Handles ball movement.
func _physics_process(delta: float) -> void:
	if is_on_wall():
		direction.y *= -1 # When hits wall changes ball's direction
	_velocity.y = speed.y * direction.y * delta
	_velocity.x = speed.x * direction.x * delta
	_velocity = move_and_slide(_velocity)




