# frozen-string-literal: true

require 'tree'

EMPTY_HEAP_EXCEPTION = 'Heap is empty'

module DataStructures
  module BinaryHeapType
    MIN = 'min'
    MAX = 'max'
  end

  class BinaryHeap
    attr_reader :size

    def initialize(heap_type, predicate)
      @root = nil
      @size = 0
      @heap_type = heap_type
      @predicate = predicate
    end

    def insert(elem)
      to_insert = BinaryTreeNode.new(elem, nil, nil, nil)
      if @root.nil?
        @root = to_insert
        @size += 1
        return true
      end

      insert_at = insert_node
      to_insert.parent = insert_at
      if leaf?(insert_at)
        insert_at.left = to_insert
      else
        insert_at.right = to_insert
      end

      swap(to_insert.parent, to_insert) while !to_insert.parent.nil? && priority(to_insert.parent, to_insert).positive?
      @size += 1
      true
    end

    def insert_all(elems)
      result = true
      elems.each do |elem|
        success = insert(elem)
        result &&= success
      end
      result
    end

    # Removes and returns the root of the heap.
    def remove_top
      return raise EMPTY_HEAP_EXCEPTION if @root.nil?

      new_root = remove_node
      value = @root.value
      if root?(new_root)
        @root = nil
        @size = 0
        return value
      end
      if relationship(new_root.parent, new_root) == BinaryNodeRelationship::LEFT_CHILD
        new_root.parent.left = nil
      else
        new_root.parent.right = nil
      end
      new_root.parent = nil
      new_root.left = @root.left
      new_root.right = @root.right

      current = new_root
      did_swap = false
      until leaf?(current)
        # Because of the insertion strategy,
        # it is impossible for the left child to not exist if the current is not a leaf.
        left_priority = priority(current.left, current)
        right_priority = current.right.nil? ? nil : priority(current.right, current)

        if right_priority.nil? # There is only a left child.
          break unless left_priority.negative?

          swap(current, current.left)
        else # Both children exist.
          # Node is in the correct position.
          break if priority(current, current.left).negative? && priority(current, current.right).negative?

          # Otherwise, keep bubbling.
          left_right_priority = priority(current.left, current.right)
          # Bubble towards the smaller priority.
          swap(current, left_right_priority.negative? ? current.left : current.right)
        end
        did_swap = true
      end
      # New root was immediately placed in the correct position, swap pointers manually.
      # This can only occur when deleting from a heap of size 3 (resulting in size 2).
      unless did_swap
        @root = new_root
        @root.parent = nil
        # No need to check the right child, since it cannot exist in a heap of size 3.
        @root.left.parent = @root unless @root.left.nil?
      end
      @size -= 1
      value
    end

    def top
      return raise EMPTY_HEAP_EXCEPTION if @root.nil?

      @root.value
    end

    def clear
      @root = nil
      @size = 0
    end

    def empty?
      @size.zero?
    end

    private

    # Swap a child with its parent.
    def swap(parent, child)
      top = parent.parent
      sibling = relationship(parent, child) == BinaryNodeRelationship::LEFT_CHILD ? parent.right : parent.left
      bottom_left = child.left
      bottom_right = child.right

      child.parent = top
      if relationship(parent, child) == BinaryNodeRelationship::LEFT_CHILD
        child.left = parent
      else
        child.right = parent
      end

      unless top.nil?
        if relationship(top, parent) == BinaryNodeRelationship::LEFT_CHILD
          top.left = child
        else
          top.right = child
        end
      end

      if sibling.nil?
        # If the sibling node doesn't exist, then the child must be a left child.
        child.right = nil
      else
        if relationship(parent, sibling) == BinaryNodeRelationship::LEFT_CHILD
          child.left = sibling
        else
          child.right = sibling
        end
        sibling.parent = child
      end
      parent.left = bottom_left
      bottom_left.parent = parent unless bottom_left.nil?
      parent.right = bottom_right
      bottom_right.parent = parent unless bottom_right.nil?

      parent.parent = child
      @root = child if root?(child)
    end

    # Counts the number of nodes in the subtree rooted at a given node.
    def subtree_size(node)
      return 0 if node.nil?

      1 + subtree_size(node.left) + subtree_size(node.right)
    end

    # Returns the node where the insert should happen.
    def insert_node
      insert_node_helper(@root)
    end

    def insert_node_helper(node)
      return node if node.left.nil? || node.right.nil?

      return insert_node_helper(node.left) if subtree_size(node.left) <= subtree_size(node.right)

      insert_node_helper(node.right)
    end

    # Returns the node that should replace the root following a call to remove_top.
    def remove_node
      remove_node_helper(@root)
    end

    def remove_node_helper(node)
      return node if leaf?(node)

      return remove_node_helper(node.right) if subtree_size(node.left) <= subtree_size(node.right)

      remove_node_helper(node.left)
    end

    # Completes the sentence: b is a's ______.
    def relationship(a, b)
      return BinaryNodeRelationship::LEFT_CHILD if !a.left.nil? && a.left == b

      return BinaryNodeRelationship::RIGHT_CHILD if !a.right.nil? && a.right == b

      return BinaryNodeRelationship::PARENT if !a.parent.nil? && a.parent == b

      BinaryNodeRelationship::NONE
    end

    def root?(node)
      node.parent.nil?
    end

    def leaf?(node)
      number_of_children(node).zero?
    end

    def number_of_children(node)
      (!node.left.nil? && 1 || 0) + (!node.right.nil? && 1 || 0)
    end

    # Lowest priority at the top.
    def priority(a, b)
      return raise "Element already exists in heap: #{a.value}" if @predicate.call(a.value, b.value).zero?

      return @predicate.call(a.value, b.value) if @heap_type == BinaryHeapType::MIN

      -@predicate.call(a.value, b.value)
    end
  end
end
