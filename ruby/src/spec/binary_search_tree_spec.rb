# frozen_string_literal: true

require 'tree'
require 'binary_search_tree'

# See tree.resources.ts for the diagram.
BINARY_SEARCH_TREE_A = [50, 25, 30, 80, 60, 90, 85].freeze
BINARY_SEARCH_TREE_B = [50, -1, 100, -30, 20, 300, 10, 30, 200, 400].freeze
BINARY_SEARCH_TREE_C = [50, 25, 30, 80, 60, 90, 85, 87].freeze
BINARY_SEARCH_TREE_D = [50, -1, 100, -30, 20, 300, 10, 30, 200, 400, 5].freeze
BINARY_SEARCH_TREE_E = [6, 5, 4, 3, 2, 1].freeze

describe 'Binary Search Tree' do
  before :each do
    @bst = DataStructures::BinarySearchTree.new(->(a, b) { a <=> b })
  end

  after :each do
    @bst = nil
  end

  def reset_tree_a
    @bst.clear
    @bst.insert_all(BINARY_SEARCH_TREE_A)
    expect(@bst.in_order).to eq [25, 30, 50, 60, 80, 85, 90]
  end

  def reset_tree_b
    @bst.clear
    @bst.insert_all(BINARY_SEARCH_TREE_B)
    expect(@bst.in_order).to eq [-30, -1, 10, 20, 30, 50, 100, 200, 300, 400]
  end

  it 'should get the correct relationship between two nodes' do
    a = DataStructures::BinaryTreeNode.new('a', nil, nil, nil)
    b = DataStructures::BinaryTreeNode.new('b', nil, nil, nil)
    expect(@bst.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::NONE

    a.left = b
    expect(@bst.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::LEFT_CHILD
    a.left = nil

    a.right = b
    expect(@bst.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::RIGHT_CHILD
    a.right = nil

    a.parent = b
    expect(@bst.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::PARENT
  end

  it 'should insert elements correctly' do
    @bst.insert(4)
    @bst.insert(-2)
    @bst.insert(10)
    @bst.insert(1000)
    @bst.insert(3)
    expect(@bst.size).to eq 5
    expect(@bst.in_order).to eq [-2, 3, 4, 10, 1000]

    @bst.clear
    expect(@bst.empty?).to be true

    @bst.insert(4)
    expect(@bst.insert(4)).to be false
    expect(@bst.size).to eq 1

    @bst.clear
    expect(@bst.insert_all([1, 2, 3, 4, 5])).to be true
    expect(@bst.size).to eq 5
    expect(@bst.insert_all([4, 5, -1, -2, -3])).to be false
    expect(@bst.size).to eq 8
    expect(@bst.in_order).to eq [-3, -2, -1, 1, 2, 3, 4, 5]
  end

  it 'should delete elements correctly' do
    # Delete leaves only.
    reset_tree_a
    @bst.delete(60)
    expect(@bst.in_order).to eq [25, 30, 50, 80, 85, 90]
    @bst.delete(85)
    expect(@bst.in_order).to eq [25, 30, 50, 80, 90]
    @bst.delete(90)
    expect(@bst.in_order).to eq [25, 30, 50, 80]
    @bst.delete(80)
    expect(@bst.in_order).to eq [25, 30, 50]
    @bst.delete(30)
    expect(@bst.in_order).to eq [25, 50]
    @bst.delete(25)
    expect(@bst.in_order).to eq [50]

    # Delete nodes with one child.
    reset_tree_a
    @bst.delete(90)
    expect(@bst.in_order).to eq [25, 30, 50, 60, 80, 85]
    @bst.delete(25)
    expect(@bst.in_order).to eq [30, 50, 60, 80, 85]

    # Delete non-existant nodes.
    expect(@bst.delete(90)).to be false
    expect(@bst.delete(123)).to be false

    # Delete nodes with two children.
    reset_tree_b
    @bst.delete(-1)
    expect(@bst.in_order).to eq [-30, 10, 20, 30, 50, 100, 200, 300, 400]
    @bst.delete(10)
    expect(@bst.in_order).to eq [-30, 20, 30, 50, 100, 200, 300, 400]
    @bst.delete(20)
    expect(@bst.in_order).to eq [-30, 30, 50, 100, 200, 300, 400]
    @bst.delete(30)
    expect(@bst.in_order).to eq [-30, 50, 100, 200, 300, 400]
    @bst.delete(300)
    expect(@bst.in_order).to eq [-30, 50, 100, 200, 400]
    @bst.delete(400)
    expect(@bst.in_order).to eq [-30, 50, 100, 200]
    @bst.delete(100)
    expect(@bst.in_order).to eq [-30, 50, 200]
    @bst.delete(50)
    expect(@bst.instance_variable_get('@root').value).to eq 200
    expect(@bst.in_order).to eq [-30, 200]

    # Delete the root only.
    reset_tree_a
    @bst.delete(50)
    expect(@bst.instance_variable_get('@root').value).to eq 60
    expect(@bst.in_order).to eq [25, 30, 60, 80, 85, 90]
    @bst.delete(60)
    expect(@bst.instance_variable_get('@root').value).to eq 80
    expect(@bst.in_order).to eq [25, 30, 80, 85, 90]
    @bst.delete(80)
    expect(@bst.instance_variable_get('@root').value).to eq 85
    expect(@bst.in_order).to eq [25, 30, 85, 90]
    @bst.delete(85)
    expect(@bst.instance_variable_get('@root').value).to eq 90
    expect(@bst.in_order).to eq [25, 30, 90]
    @bst.delete(90)
    expect(@bst.instance_variable_get('@root').value).to eq 25
    expect(@bst.in_order).to eq [25, 30]
    @bst.delete(25)
    expect(@bst.instance_variable_get('@root').value).to eq 30
    expect(@bst.in_order).to eq [30]
    @bst.delete(30)
    expect(@bst.empty?).to be true
    expect(@bst.delete(0)).to be false
  end

  it 'should only find elements that exist' do
    expect(@bst.search(123)).to be false

    reset_tree_a
    expect(@bst.search(50)).to be true
    expect(@bst.search(85)).to be true
    expect(@bst.search(25)).to be true
    expect(@bst.search(123)).to be false

    @bst.delete(50)
    expect(@bst.search(50)).to be false
  end

  it 'should get the depth of elements' do
    reset_tree_b
    expect(@bst.depth(50)).to eq 0
    expect(@bst.depth(100)).to eq 1
    expect(@bst.depth(20)).to eq 2
    expect(@bst.depth(200)).to eq 3
    expect(@bst.depth(10)).to eq 3
    expect(@bst.depth(123)).to eq(-1)
  end

  it 'should do pre and post-order correctly' do
    expect(@bst.pre_order).to eq []
    expect(@bst.post_order).to eq []

    reset_tree_a
    expect(@bst.pre_order).to eq [50, 25, 30, 80, 60, 90, 85]
    expect(@bst.post_order).to eq [30, 25, 60, 85, 90, 80, 50]

    reset_tree_b
    expect(@bst.pre_order).to eq [50, -1, -30, 20, 10, 30, 100, 300, 200, 400]
    expect(@bst.post_order).to eq [-30, 10, 30, 20, -1, 200, 400, 300, 100, 50]
  end
end
