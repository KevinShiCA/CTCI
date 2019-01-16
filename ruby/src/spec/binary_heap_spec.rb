# frozen_string_literal: true

require 'binary_heap'

predicate = ->(a, b) { a <=> b }

describe 'Min Binary Heap' do
  heap = DataStructures::BinaryHeap.new(DataStructures::BinaryHeapType::MIN, predicate)

  it 'should get the correct relationship between two nodes' do
    a = DataStructures::BinaryTreeNode.new('a', nil, nil, nil)
    b = DataStructures::BinaryTreeNode.new('b', nil, nil, nil)
    expect(heap.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::NONE

    a.left = b
    expect(heap.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::LEFT_CHILD
    a.left = nil

    a.right = b
    expect(heap.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::RIGHT_CHILD
    a.right = nil

    a.parent = b
    expect(heap.send(:relationship, a, b)).to eq DataStructures::BinaryNodeRelationship::PARENT
  end

  it 'should insert elements and remove top correctly' do
    # Basic insertion, no bubbling.
    heap.insert_all([3, 5, 6, 7, 8])
    expect(heap.top).to eq 3
    expect(heap.remove_top).to eq 3
    expect(heap.size).to eq 4
    expect(heap.top).to eq 5
    expect(heap.remove_top).to eq 5
    expect(heap.size).to eq 3
    heap.clear
    expect(heap.empty?).to be true

    # Complex insertion, lots of bubbling.
    heap.insert_all([5, 2, 9, -1, -2, 10, -10, 30, 3])
    expect(heap.remove_top).to eq(-10)
    expect(heap.remove_top).to eq(-2)
    expect(heap.remove_top).to eq(-1)
    expect(heap.remove_top).to eq 2
    expect(heap.remove_top).to eq 3
    expect(heap.remove_top).to eq 5
    expect(heap.remove_top).to eq 9
    expect(heap.remove_top).to eq 10
    expect(heap.remove_top).to eq 30
    expect(heap.empty?).to be true
    expect { heap.top }.to raise_error 'Heap is empty'
    expect { heap.remove_top }.to raise_error 'Heap is empty'

    # Edge case where one subtree is extremely clustered in value compared to the other.
    heap.insert_all([500, 1000, 1100, 2000, 1200, 3000, 1300, 4000, 1500])
    expect(heap.remove_top).to eq 500
    expect(heap.remove_top).to eq 1000
    expect(heap.remove_top).to eq 1100
    expect(heap.remove_top).to eq 1200
    expect(heap.remove_top).to eq 1300
    expect(heap.remove_top).to eq 1500
    expect(heap.remove_top).to eq 2000
    expect(heap.remove_top).to eq 3000
    expect(heap.remove_top).to eq 4000
    expect(heap.empty?).to be true
    expect { heap.top }.to raise_error 'Heap is empty'
    expect { heap.remove_top }.to raise_error 'Heap is empty'
  end
end

describe 'Max Binary Heap' do
  before :each do
    @heap = DataStructures::BinaryHeap.new(DataStructures::BinaryHeapType::MAX, predicate)
  end

  after :each do
    @heap = nil
  end

  it 'should insert elements and remove top correctly' do
    # Basic insertion, no bubbling
    @heap.insert_all([8, 7, 5, 2, -1])
    expect(@heap.top).to eq 8
    expect(@heap.remove_top).to eq 8
    expect(@heap.size).to eq 4
    expect(@heap.top).to eq 7
    expect(@heap.remove_top).to eq 7
    expect(@heap.size).to eq 3
    @heap.clear
    expect(@heap.empty?).to be true

    # Complex insertion, lots of bubbling.
    @heap.insert_all([5, 2, 9, -1, -2, 10, -10, 30, 3])
    expect(@heap.remove_top).to eq 30
    expect(@heap.remove_top).to eq 10
    expect(@heap.remove_top).to eq 9
    expect(@heap.remove_top).to eq 5
    expect(@heap.remove_top).to eq 3
    expect(@heap.remove_top).to eq 2
    expect(@heap.remove_top).to eq(-1)
    expect(@heap.remove_top).to eq(-2)
    expect(@heap.remove_top).to eq(-10)
    expect(@heap.empty?).to be true
    expect { @heap.top }.to raise_error 'Heap is empty'
    expect { @heap.remove_top }.to raise_error 'Heap is empty'

    # Duplicate insertion.
    @heap.insert(3)
    expect { @heap.insert(3) }.to raise_error 'Element already exists in heap: 3'
    expect(@heap.size).to eq 1
  end

  it 'should perform heapsort' do
    @heap.insert_all([3, -1, 2000, 40, -123, 401, -9, 1005])

    result = []
    result.unshift(@heap.remove_top) until @heap.empty?
    expect(result).to eq [-123, -9, -1, 3, 40, 401, 1005, 2000]
  end
end
