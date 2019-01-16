# frozen-string-literal: true

require 'tree'

module DataStructures
  class BinarySearchTree
    attr_reader :size

    def initialize(predicate)
      @root = nil
      @size = 0
      @predicate = predicate
    end

    def insert(elem)
      to_insert = BinaryTreeNode.new(elem, nil, nil, nil)
      if @root.nil?
        @root = to_insert
        @size += 1
        return true
      end

      current = @root
      until leaf?(current)
        return false if @predicate.call(elem, current.value).zero?

        if @predicate.call(elem, current.value).negative?
          break if current.left.nil?

          current = current.left
        else
          break if current.right.nil?

          current = current.right
        end
      end

      return false if @predicate.call(elem, current.value).zero?

      to_insert.parent = current
      if @predicate.call(elem, current.value).negative?
        current.left = to_insert
      else
        current.right = to_insert
      end
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

    def delete(elem)
      current = @root
      until current.nil? || @predicate.call(elem, current.value).zero?
        current = if @predicate.call(elem, current.value).negative?
                    current.left
                  else
                    current.right
                  end
      end
      # Element does not exist.
      return false if current.nil?

      root_replacement = nil # Used only if deleting the root.
      if leaf?(current)
        unless root?(current)
          if relationship(current.parent, current) == BinaryNodeRelationship::LEFT_CHILD
            current.parent.left = nil
          else
            current.parent.right = nil
          end
        end
      elsif number_of_children(current) == 1 # Element has one child.
        # Replace with the left or right child, whichever exists.
        replacement = current.left || current.right
        replacement.parent = current.parent
        if root?(current)
          root_replacement = current.left || current.right
          root_replacement.parent = nil
        elsif relationship(current.parent, current) == BinaryNodeRelationship::LEFT_CHILD
          current.parent.left = replacement
        else
          current.parent.right = replacement
        end
      else # Element has two children
        # Find the minimum in the right subtree, replace the node with it.
        min_right = min_in_subtree(current.right)
        # The replacement node is either a leaf or has a right child.
        if relationship(min_right.parent, min_right) == BinaryNodeRelationship::LEFT_CHILD
          min_right.parent.left = min_right.right
        else
          min_right.parent.right = min_right.right
        end

        min_right.parent = current.parent
        min_right.left = current.left
        min_right.right = current.right
        min_right.left.parent = min_right unless min_right.left.nil?
        min_right.right.parent = min_right unless min_right.right.nil?

        if root?(current)
          min_right.parent = nil
          root_replacement = min_right
        elsif relationship(current.parent, current) == BinaryNodeRelationship::LEFT_CHILD
          min_right.parent.left = min_right
        else
          min_right.parent.right = min_right
        end
      end
      @root = root_replacement if @predicate.call(elem, @root.value).zero?
      @size -= 1
      true
    end

    def search(elem)
      return false if @root.nil?

      search_helper(elem, @root)
    end

    def depth(elem)
      d = 0
      current = @root
      until current.nil?
        return d if @predicate.call(elem, current.value).zero?

        current = if @predicate.call(elem, current.value).negative?
                    current.left
                  else
                    current.right
                  end
        d += 1
      end
      -1
    end

    def clear
      @root = nil
      @size = 0
    end

    def in_order
      result = []
      in_order_helper(@root, result)
      result
    end

    def pre_order
      result = []
      pre_order_helper(@root, result)
      result
    end

    def post_order
      result = []
      post_order_helper(@root, result)
      result
    end

    def empty?
      @size.zero?
    end

    protected

    def in_order_helper(node, result)
      return if node.nil?

      in_order_helper(node.left, result)
      result.push(node.value)
      in_order_helper(node.right, result)
    end

    def pre_order_helper(node, result)
      return if node.nil?

      result.push(node.value)
      pre_order_helper(node.left, result)
      pre_order_helper(node.right, result)
    end

    def post_order_helper(node, result)
      return if node.nil?

      post_order_helper(node.left, result)
      post_order_helper(node.right, result)
      result.push(node.value)
    end

    def search_helper(elem, node)
      return false if node.nil?

      return true if @predicate.call(elem, node.value).zero?

      return search_helper(elem, node.left) if @predicate.call(elem, node.value).negative?

      search_helper(elem, node.right)
    end

    # Returns the minimum node in the subtree rooted at a given node.
    def min_in_subtree(node)
      current = node
      current = current.left until current.left.nil?
      current
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
  end
end
