# frozen-string-literal: true

module DataStructures
  class TreeNode
    attr_accessor :value, :parent

    def initialize(value, parent)
      @value = value
      @parent = parent
    end
  end

  class BinaryTreeNode < TreeNode
    attr_accessor :left, :right

    def initialize(value, parent, left, right)
      super(value, parent)
      @left = left
      @right = right
    end
  end

  class NaryTreeNode < TreeNode
    attr_accessor :children

    def initialize(value, parent, children)
      super(value, parent)
      @children = children
    end
  end

  module BinaryNodeRelationship
    LEFT_CHILD = 'left'
    RIGHT_CHILD = 'right'
    PARENT = 'parent'
    NONE = 'none'
  end
end
