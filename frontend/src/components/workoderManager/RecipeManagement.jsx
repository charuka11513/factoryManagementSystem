import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, Button, Modal, Form, Row, Col, Card, 
  Spinner, Alert, Badge, InputGroup 
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL2 } from '../TEST/Utils/config';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({
    product_id: '',
    product_name: '',
    category: '',
    labor_hours_per_unit: 0,
    labor_cost_per_hour: 0,
    overhead_cost_per_unit: 0,
    production_capacity_per_day: 0,
    materials_required: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  
  // For adding/removing material inputs
  const [tempMaterial, setTempMaterial] = useState({
    material_id: '',
    material_name: '',
    quantity_per_unit: 0,
    unit_of_measure: 'kg'
  });

  useEffect(() => {
    fetchRecipes();
    fetchMaterials();
  }, []);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL2}/production/recipes`);
      if (response.data.success) {
        setRecipes(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch recipes');
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${BASE_URL2}/inventorys`);
      if (response.data.success) {
        setMaterials(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const openAddModal = () => {
    setCurrentRecipe({
      product_id: '',
      product_name: '',
      category: '',
      labor_hours_per_unit: 0,
      labor_cost_per_hour: 0,
      overhead_cost_per_unit: 0,
      production_capacity_per_day: 0,
      materials_required: []
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (recipe) => {
    setCurrentRecipe(recipe);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, convert to numbers
    if (['labor_hours_per_unit', 'labor_cost_per_hour', 'overhead_cost_per_unit', 'production_capacity_per_day'].includes(name)) {
      setCurrentRecipe({
        ...currentRecipe,
        [name]: parseFloat(value) || 0
      });
    } else {
      setCurrentRecipe({
        ...currentRecipe,
        [name]: value
      });
    }
  };

  const handleTempMaterialChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'material_id' && value) {
      // When material is selected, automatically set its name
      const selectedMaterial = materials.find(m => m._id === value);
      if (selectedMaterial) {
        setTempMaterial({
          ...tempMaterial,
          material_id: value,
          material_name: selectedMaterial.Material_Name
        });
      }
    } else if (name === 'quantity_per_unit') {
      setTempMaterial({
        ...tempMaterial,
        [name]: parseFloat(value) || 0
      });
    } else {
      setTempMaterial({
        ...tempMaterial,
        [name]: value
      });
    }
  };

  const addMaterialToRecipe = () => {
    if (!tempMaterial.material_id || tempMaterial.quantity_per_unit <= 0) {
      toast.warning('Please select a material and enter a valid quantity');
      return;
    }
    
    // Check if material already exists in recipe
    const exists = currentRecipe.materials_required.some(
      m => m.material_id === tempMaterial.material_id
    );
    
    if (exists) {
      toast.warning('This material is already in the recipe');
      return;
    }
    
    setCurrentRecipe({
      ...currentRecipe,
      materials_required: [...currentRecipe.materials_required, { ...tempMaterial }]
    });
    
    // Reset temp material
    setTempMaterial({
      material_id: '',
      material_name: '',
      quantity_per_unit: 0,
      unit_of_measure: 'kg'
    });
  };

  const removeMaterialFromRecipe = (index) => {
    const updatedMaterials = [...currentRecipe.materials_required];
    updatedMaterials.splice(index, 1);
    setCurrentRecipe({
      ...currentRecipe,
      materials_required: updatedMaterials
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentRecipe.product_id) newErrors.product_id = 'Product ID is required';
    if (!currentRecipe.product_name) newErrors.product_name = 'Product name is required';
    if (!currentRecipe.category) newErrors.category = 'Category is required';
    if (currentRecipe.labor_hours_per_unit <= 0) newErrors.labor_hours_per_unit = 'Labor hours must be greater than 0';
    if (currentRecipe.labor_cost_per_hour <= 0) newErrors.labor_cost_per_hour = 'Labor cost must be greater than 0';
    if (currentRecipe.production_capacity_per_day <= 0) newErrors.production_capacity_per_day = 'Production capacity must be greater than 0';
    
    if (currentRecipe.materials_required.length === 0) {
      newErrors.materials = 'At least one material is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL2}/production/recipes/${currentRecipe._id}`, currentRecipe);
        toast.success('Recipe updated successfully');
      } else {
        await axios.post(`${BASE_URL2}/production/recipes`, currentRecipe);
        toast.success('Recipe created successfully');
      }
      
      setShowModal(false);
      fetchRecipes();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update recipe' : 'Failed to create recipe');
      console.error('Error saving recipe:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`${BASE_URL2}/production/recipes/${id}`);
        toast.success('Recipe deleted successfully');
        fetchRecipes();
      } catch (error) {
        toast.error('Failed to delete recipe');
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Production Recipes</h3>
          <div className="d-flex gap-2">
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button 
              variant="primary" 
              onClick={openAddModal}
            >
              <FaPlus className="me-1" /> Add Recipe
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading recipes...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <Alert variant="info">
              No recipes found. Create a new recipe to get started.
            </Alert>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Materials</th>
                  <th>Labor (hours)</th>
                  <th>Production Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipes.map((recipe) => (
                  <tr key={recipe._id}>
                    <td>{recipe.product_id}</td>
                    <td>{recipe.product_name}</td>
                    <td>
                      <Badge bg="secondary">{recipe.category}</Badge>
                    </td>
                    <td>
                      {recipe.materials_required.map((material, index) => (
                        <div key={index} className="mb-1">
                          <small>
                            {material.material_name} ({material.quantity_per_unit} {material.unit_of_measure})
                          </small>
                        </div>
                      ))}
                    </td>
                    <td>{recipe.labor_hours_per_unit}</td>
                    <td>{recipe.production_capacity_per_day} units/day</td>
                    <td>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openEditModal(recipe)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(recipe._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Recipe Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="product_id"
                    value={currentRecipe.product_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.product_id}
                    placeholder="e.g., RUBBER-001"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.product_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="product_name"
                    value={currentRecipe.product_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.product_name}
                    placeholder="e.g., Standard Rubber Band"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.product_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={currentRecipe.category}
                    onChange={handleInputChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select Category</option>
                    <option value="rubber">Rubber</option>
                    <option value="brush">Brush</option>
                    <option value="plastic">Plastic</option>
                    <option value="metal">Metal</option>
                    <option value="other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Labor Hours/Unit</Form.Label>
                  <Form.Control
                    type="number"
                    name="labor_hours_per_unit"
                    value={currentRecipe.labor_hours_per_unit}
                    onChange={handleInputChange}
                    isInvalid={!!errors.labor_hours_per_unit}
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.labor_hours_per_unit}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Labor Cost/Hour ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="labor_cost_per_hour"
                    value={currentRecipe.labor_cost_per_hour}
                    onChange={handleInputChange}
                    isInvalid={!!errors.labor_cost_per_hour}
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.labor_cost_per_hour}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Overhead Cost/Unit ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="overhead_cost_per_unit"
                    value={currentRecipe.overhead_cost_per_unit}
                    onChange={handleInputChange}
                    isInvalid={!!errors.overhead_cost_per_unit}
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.overhead_cost_per_unit}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Production Capacity/Day</Form.Label>
                  <Form.Control
                    type="number"
                    name="production_capacity_per_day"
                    value={currentRecipe.production_capacity_per_day}
                    onChange={handleInputChange}
                    isInvalid={!!errors.production_capacity_per_day}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.production_capacity_per_day}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5>Materials Required</h5>
            {errors.materials && (
              <Alert variant="danger">{errors.materials}</Alert>
            )}

            {/* Materials List */}
            {currentRecipe.materials_required.length > 0 ? (
              <Table striped bordered className="mb-3">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Quantity per Unit</th>
                    <th>Unit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecipe.materials_required.map((material, index) => (
                    <tr key={index}>
                      <td>{material.material_name}</td>
                      <td>{material.quantity_per_unit}</td>
                      <td>{material.unit_of_measure}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeMaterialFromRecipe(index)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="light">No materials added yet</Alert>
            )}

            {/* Add Material Form */}
            <Row className="mt-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Material</Form.Label>
                  <Form.Select
                    name="material_id"
                    value={tempMaterial.material_id}
                    onChange={handleTempMaterialChange}
                  >
                    <option value="">Select Material</option>
                    {materials.map((material) => (
                      <option key={material._id} value={material._id}>
                        {material.Material_Name} (Stock: {material.Stock_Quantity})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Quantity per Unit</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity_per_unit"
                    value={tempMaterial.quantity_per_unit}
                    onChange={handleTempMaterialChange}
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    name="unit_of_measure"
                    value={tempMaterial.unit_of_measure}
                    onChange={handleTempMaterialChange}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="success" 
                  className="w-100 mb-3"
                  onClick={addMaterialToRecipe}
                >
                  <FaPlus className="me-1" /> Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Update Recipe' : 'Save Recipe'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default RecipeManagement;